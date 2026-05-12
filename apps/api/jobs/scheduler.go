package jobs

import (
	"context"
	"log"
	"time"
)

type Job interface {
	Name() string
	Run(ctx context.Context) error
	Schedule() time.Duration
}

type Scheduler struct {
	jobs    []Job
	running bool
	ctx     context.Context
	cancel  context.CancelFunc
}

func NewScheduler() *Scheduler {
	ctx, cancel := context.WithCancel(context.Background())
	return &Scheduler{
		jobs:    make([]Job, 0),
		running: false,
		ctx:     ctx,
		cancel:  cancel,
	}
}

func (s *Scheduler) Register(job Job) {
	s.jobs = append(s.jobs, job)
	log.Printf("[Scheduler] Registered job: %s (runs every %v)", job.Name(), job.Schedule())
}

func (s *Scheduler) Start() {
	if s.running {
		return
	}

	s.running = true
	log.Println("[Scheduler] Starting background jobs...")

	for _, job := range s.jobs {
		go s.runJob(job)
	}
}

func (s *Scheduler) runJob(job Job) {
	ticker := time.NewTicker(job.Schedule())
	defer ticker.Stop()

	log.Printf("[Scheduler] Started job: %s", job.Name())

	if err := job.Run(s.ctx); err != nil {
		log.Printf("[Scheduler] Job %s failed: %v", job.Name(), err)
	}

	for {
		select {
		case <-ticker.C:
			start := time.Now()
			if err := job.Run(s.ctx); err != nil {
				log.Printf("[Scheduler] Job %s failed: %v", job.Name(), err)
			} else {
				log.Printf("[Scheduler] Job %s completed in %v", job.Name(), time.Since(start))
			}
		case <-s.ctx.Done():
			log.Printf("[Scheduler] Stopped job: %s", job.Name())
			return
		}
	}
}

func (s *Scheduler) Stop() {
	if !s.running {
		return
	}

	log.Println("[Scheduler] Stopping background jobs...")
	s.cancel()
	s.running = false
}

func (s *Scheduler) IsRunning() bool {
	return s.running
}

func (s *Scheduler) GetJobs() []string {
	names := make([]string, len(s.jobs))
	for i, job := range s.jobs {
		names[i] = job.Name()
	}
	return names
}
