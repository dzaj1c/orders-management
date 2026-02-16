CREATE OR REPLACE FUNCTION get_orders_stats_7d(start_iso timestamptz, end_iso timestamptz)
RETURNS json
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  start_date date := (date_trunc('day', start_iso AT TIME ZONE 'UTC'))::date;
  delivered_by_day int[] := array_fill(0, ARRAY[7]);
  delivered_total int := 0;
  delivered_customers int := 0;
  delivered_customers_by_day int[] := array_fill(0, ARRAY[7]);
  canceled_by_day int[] := array_fill(0, ARRAY[7]);
  canceled_total int := 0;
  r record;
  idx int;
BEGIN
  FOR r IN
    SELECT
      (date_trunc('day', o.updated_at AT TIME ZONE 'UTC')::date - start_date) AS day_idx,
      count(*)::int AS cnt,
      count(DISTINCT o.customer_name)::int AS distinct_cust
    FROM orders o
    WHERE o.status = 'DELIVERED'
      AND o.updated_at >= start_iso
      AND o.updated_at <= end_iso
    GROUP BY date_trunc('day', o.updated_at AT TIME ZONE 'UTC')::date
  LOOP
    idx := r.day_idx;
    IF idx >= 0 AND idx <= 6 THEN
      delivered_by_day[idx + 1] := r.cnt;
      delivered_customers_by_day[idx + 1] := r.distinct_cust;
      delivered_total := delivered_total + r.cnt;
    END IF;
  END LOOP;

  SELECT count(DISTINCT customer_name)::int INTO delivered_customers
  FROM orders
  WHERE status = 'DELIVERED' AND updated_at >= start_iso AND updated_at <= end_iso;

  FOR r IN
    SELECT
      (date_trunc('day', o.updated_at AT TIME ZONE 'UTC')::date - start_date) AS day_idx,
      count(*)::int AS cnt
    FROM orders o
    WHERE o.status = 'CANCELED'
      AND o.updated_at >= start_iso
      AND o.updated_at <= end_iso
    GROUP BY date_trunc('day', o.updated_at AT TIME ZONE 'UTC')::date
  LOOP
    idx := r.day_idx;
    IF idx >= 0 AND idx <= 6 THEN
      canceled_by_day[idx + 1] := r.cnt;
      canceled_total := canceled_total + r.cnt;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'delivered_by_day', delivered_by_day,
    'delivered_total', delivered_total,
    'delivered_customers', delivered_customers,
    'delivered_customers_by_day', delivered_customers_by_day,
    'canceled_by_day', canceled_by_day,
    'canceled_total', canceled_total
  );
END;
$$;
