"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, Upload, FileText } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Badge } from '@/components/ui';
import { FileUpload } from '@/components/forms';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

interface Document {
  name: string;
  status: VerificationStatus;
  uploadedAt: string;
  feedback?: string;
}

export default function DriverVerifyPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Driver's License",
      status: 'pending',
      uploadedAt: '2024-01-15',
    },
    {
      name: 'Government ID',
      status: 'approved',
      uploadedAt: '2024-01-15',
    },
    {
      name: 'Proof of Address',
      status: 'pending',
      uploadedAt: '2024-01-15',
    },
  ]);
  
  const [showReupload, setShowReupload] = useState<string | null>(null);
  
  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={24} weight="fill" className="text-green-600" />;
      case 'rejected':
        return <XCircle size={24} weight="fill" className="text-red-600" />;
      default:
        return <Clock size={24} weight="fill" className="text-yellow-600" />;
    }
  };
  
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Review</Badge>;
    }
  };
  
  const overallStatus = documents.every(d => d.status === 'approved')
    ? 'approved'
    : documents.some(d => d.status === 'rejected')
    ? 'rejected'
    : 'pending';
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="md">
          <div className="py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <FileText size={40} weight="bold" className="text-gray-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                Document Verification
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're reviewing your documents. This usually takes 24-48 hours.
              </p>
            </div>
            
            {/* Overall Status */}
            <div className={`
              p-6 rounded-lg mb-8 border-2
              ${overallStatus === 'approved' ? 'bg-green-50 border-green-200' : 
                overallStatus === 'rejected' ? 'bg-red-50 border-red-200' : 
                'bg-yellow-50 border-yellow-200'}
            `}>
              <div className="flex items-center gap-4">
                {getStatusIcon(overallStatus)}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {overallStatus === 'approved' && 'Verification Complete!'}
                    {overallStatus === 'rejected' && 'Action Required'}
                    {overallStatus === 'pending' && 'Verification In Progress'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {overallStatus === 'approved' && 'All documents have been approved. You can now access gig vehicles.'}
                    {overallStatus === 'rejected' && 'Some documents need to be resubmitted. Please check below.'}
                    {overallStatus === 'pending' && "Our team is reviewing your documents. You'll be notified once complete."}
                  </p>
                </div>
                {overallStatus === 'approved' && (
                  <Link href="/driver/dashboard">
                    <Button variant="primary">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Documents List */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Submitted Documents
              </h2>
              
              {documents.map((doc, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {doc.feedback && (
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {doc.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  {doc.status === 'rejected' && (
                    <div>
                      {showReupload === doc.name ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <FileUpload
                            label="Upload New Document"
                            accept="image/*,.pdf"
                            onChange={(files) => {
                              // Handle reupload
                              console.log('Reuploading:', files);
                              setShowReupload(null);
                            }}
                          />
                          <div className="flex gap-2 mt-4">
                            <Button variant="primary" size="sm">
                              Submit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowReupload(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowReupload(doc.name)}
                        >
                          <Upload size={16} weight="bold" />
                          Reupload Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* What's Next */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What Happens Next?
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Document Review
                    </p>
                    <p className="text-sm text-gray-600">
                      Our team reviews your documents within 24-48 hours.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Approval Notification
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email and SMS once approved.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Access Dashboard
                    </p>
                    <p className="text-sm text-gray-600">
                      Start browsing and booking eco-gig vehicles immediately.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            
            {/* Help */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Need help with verification?
              </p>
              <Link href="/help">
                <Button variant="secondary">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
}
