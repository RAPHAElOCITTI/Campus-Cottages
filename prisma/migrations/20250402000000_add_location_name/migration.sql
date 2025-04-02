-- AlterTable
ALTER TABLE "Hostel" ADD COLUMN "location_name" TEXT;

-- Update existing entries to have a basic location_name if lat/long is available
UPDATE "Hostel"
SET "location_name" = CASE
    WHEN "latitude" IS NOT NULL AND "longitude" IS NOT NULL
    THEN CONCAT('Location at ', ROUND("latitude"::numeric, 5), ', ', ROUND("longitude"::numeric, 5))
    ELSE NULL
END
WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL;