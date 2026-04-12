import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  // Allow CORS if necessary
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {

        // Generate a client token for the browser to upload the file.
        // You can add authorization logic here (e.g., checking user sessions).
        // Since this is a public form, we allow it.
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
          tokenPayload: JSON.stringify({
            // Optional: pass custom metadata to onUploadCompleted
            source: 'video-submission-form'
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called by Vercel Blob after the upload is successfully finished.
        console.log('Upload completed:', blob.url);
        // You could theoretically update your database here, 
        // but we're doing it in step 2 via submit-video-metadata.js for the full form data.
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Blob upload error:', error);
    return response.status(400).json(
      { error: error.message }
    );
  }
}

