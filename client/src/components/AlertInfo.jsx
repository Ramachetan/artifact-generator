// components/AlertInfo.jsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AlertInfo = () => (
  <Alert className="mb-6">
    <AlertTitle>How to use</AlertTitle>
    <AlertDescription>
      Paste your React code in the text area below and click "Render Code" to see it in action!
    </AlertDescription>
  </Alert>
);

export default AlertInfo;