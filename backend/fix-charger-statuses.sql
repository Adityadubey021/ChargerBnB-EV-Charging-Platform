-- Fix charger statuses
-- Set isApproved=false for all chargers that are not available (suspended/rejected)

UPDATE chargers 
SET "isApproved" = false 
WHERE "isAvailable" = false AND "isApproved" = true;

-- Show current stats
SELECT 
  COUNT(*) FILTER (WHERE "isApproved" = false AND "isAvailable" = true) as pending,
  COUNT(*) FILTER (WHERE "isApproved" = true AND "isAvailable" = true) as approved,
  COUNT(*) FILTER (WHERE "isAvailable" = false) as suspended_rejected
FROM chargers;

-- Show all chargers with their status
SELECT 
  id,
  title,
  "isApproved",
  "isAvailable",
  CASE 
    WHEN "isApproved" = true AND "isAvailable" = true THEN 'APPROVED'
    WHEN "isApproved" = false AND "isAvailable" = true THEN 'PENDING'
    ELSE 'SUSPENDED/REJECTED'
  END as status
FROM chargers
ORDER BY id;
