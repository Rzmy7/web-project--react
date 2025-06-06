WITH ShopTypes AS (
    SELECT 
        s.shop_id,
        s.shop_name AS "shopName",
        s."Location" AS "location",
        s.open_status AS "status",
        s.shop_image AS "picture",
        so.opening_time AS "opentime",
        so.closing_time AS "closetime",
        CASE 
            WHEN fc.fshop_id IS NOT NULL THEN 'Canteen'
            WHEN jb.jshop_id IS NOT NULL THEN 'Juice Bar'
            WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
        END AS "type",
        CASE 
            WHEN fc.fshop_id IS NOT NULL THEN 
                CASE 
                    WHEN jb.jshop_id IS NOT NULL THEN 'Juice Bar'
                    WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                END
            WHEN jb.jshop_id IS NOT NULL THEN 
                CASE 
                    WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                END
        END AS "type2",
        CASE 
            WHEN fc.fshop_id IS NOT NULL AND jb.jshop_id IS NOT NULL THEN 
                CASE 
                    WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                END
            WHEN jb.jshop_id IS NOT NULL AND bs.bshop_id IS NOT NULL THEN 'Bookshop'
        END AS "type3"
    FROM shop s
    INNER JOIN shop_open so ON s.shop_id = so.shop_id
    LEFT JOIN food_canteen fc ON s.shop_id = fc.fshop_id
    LEFT JOIN juice_bar jb ON s.shop_id = jb.jshop_id
    LEFT JOIN bookshop bs ON s.shop_id = bs.bshop_id
    WHERE so.day = 'Friday'  -- Filter for Friday
)
SELECT * FROM ShopTypes;

