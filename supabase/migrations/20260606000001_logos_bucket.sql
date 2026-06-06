-- Create the logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml']::text[]);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to logos
CREATE POLICY "Logo images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

-- Allow authenticated users to upload their own logo
CREATE POLICY "Users can upload their own logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'logos' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own logo
CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'logos' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own logo
CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'logos' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
