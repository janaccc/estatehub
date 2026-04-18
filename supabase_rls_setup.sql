-- Enable RLS on tables
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Listings policies
-- Allow everyone to view listings
CREATE POLICY "Allow public read access on listings" ON listings
FOR SELECT USING (true);

-- Allow authenticated users to insert listings
CREATE POLICY "Allow authenticated insert on listings" ON listings
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow owners to update their listings
CREATE POLICY "Allow owners to update listings" ON listings
FOR UPDATE USING (auth.uid() = user_id);

-- Allow owners to delete their listings
CREATE POLICY "Allow owners to delete listings" ON listings
FOR DELETE USING (auth.uid() = user_id);

-- Offers policies
-- Allow authenticated users to view offers on listings they own or sent
CREATE POLICY "Allow users to view relevant offers" ON offers
FOR SELECT USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT user_id FROM listings WHERE id = listing_id
  )
);

-- Allow authenticated users to insert offers
CREATE POLICY "Allow authenticated insert on offers" ON offers
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies for images bucket
-- Allow public read access to images
CREATE POLICY "Allow public read access on images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated upload on images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their images
CREATE POLICY "Allow authenticated update on images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated delete on images" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);