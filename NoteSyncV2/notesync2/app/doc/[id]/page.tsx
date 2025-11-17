//page that will be edited
/*
"use client";
import Document from '@/components/Document';
import React from 'react'

function DocumentPage({params: {id}}: {
    params: {
        id: string;
    };
}) { 
  return <div className="flex flex-col flex-1 min-h-screen">
        <Document id={id} />
    </div>
}

export default DocumentPage
*/


//can't use params.id directly now, so change in code
//unwrapped it with React.use

"use client";
import Document from '@/components/Document';
import React from 'react';

function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // unwrap the params Promise

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;
