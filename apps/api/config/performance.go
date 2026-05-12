package config

import (
	"log"
	"time"

	"gorm.io/gorm"
)

type QueryStats struct {
	Query        string
	Duration     time.Duration
	RowsAffected int64
	Timestamp    time.Time
}

var queryLog []QueryStats

func EnableQueryLogging(db *gorm.DB) {
	db.Callback().Query().Before("gorm:query").Register("query_logger", func(db *gorm.DB) {
		db.InstanceSet("query_start_time", time.Now())
	})

	db.Callback().Query().After("gorm:query").Register("query_logger", func(db *gorm.DB) {
		if startTime, ok := db.InstanceGet("query_start_time"); ok {
			duration := time.Since(startTime.(time.Time))
			if duration > 100*time.Millisecond {
				log.Printf("[SLOW QUERY] %s - Duration: %v", db.Statement.SQL.String(), duration)
			}
		}
	})
}

func GetSlowQueries(threshold time.Duration) []QueryStats {
	var slow []QueryStats
	for _, stat := range queryLog {
		if stat.Duration > threshold {
			slow = append(slow, stat)
		}
	}
	return slow
}

func AnalyzeTableStats(db *gorm.DB, tableName string) error {
	var result struct {
		RowCount     int64
		TotalSize    string
		IndexSize    string
		LastAnalyzed *time.Time
	}

	query := `
		SELECT 
			reltuples::bigint as row_count,
			pg_size_pretty(pg_total_relation_size(relid)) as total_size,
			pg_size_pretty(pg_indexes_size(relid)) as index_size,
			last_analyze as last_analyzed
		FROM pg_stat_user_tables
		WHERE relname = ?
	`

	if err := db.Raw(query, tableName).Scan(&result).Error; err != nil {
		return err
	}

	log.Printf("Table: %s | Rows: %d | Size: %s | Index Size: %s",
		tableName, result.RowCount, result.TotalSize, result.IndexSize)

	return nil
}

func GetIndexUsageStats(db *gorm.DB) error {
	query := `
		SELECT 
			schemaname,
			tablename,
			indexname,
			idx_scan as scans,
			idx_tup_read as tuples_read,
			idx_tup_fetch as tuples_fetched
		FROM pg_stat_user_indexes
		WHERE idx_scan = 0
		ORDER BY schemaname, tablename
	`

	var results []struct {
		SchemaName     string
		TableName      string
		IndexName      string
		Scans          int64
		TuplesRead     int64
		TuplesFetched  int64
	}

	if err := db.Raw(query).Scan(&results).Error; err != nil {
		return err
	}

	if len(results) > 0 {
		log.Println("Unused indexes detected:")
		for _, r := range results {
			log.Printf("  - %s.%s.%s (never used)", r.SchemaName, r.TableName, r.IndexName)
		}
	}

	return nil
}
