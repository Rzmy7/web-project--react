SELECT 
    u.user_id AS users_user_id,
    u.full_name,
    so.user_id AS shop_owner_user_id,
    s.shop_name,
    s.shopowner_id,
    s.open_status,
    s."Location",
    so_open.opening_time,
    so_open.closing_time
FROM 
    users u
    INNER JOIN shop_owner so ON u.user_id = so.user_id
    INNER JOIN shop s ON so.user_id = s.shopowner_id
    INNER JOIN shop_open so_open ON s.shop_id = so_open.shop_id
WHERE 
    s.shop_id = 'SHOP01';

















    SELECT 
    -- Count all available items (food + juice + book accessories)
    (
        SELECT COUNT(*) 
        FROM food_has fh 
        JOIN food_canteen fc ON fh.shop_id = fc.fshop_id 
        WHERE fc.fshop_id = 'SH06' AND fh.food_avalability = true
    ) + (
        SELECT COUNT(*) 
        FROM juice_has jh 
        JOIN juice_bar jb ON jh.shop_id = jb.jshop_id 
        WHERE jb.jshop_id = 'SH06' AND jh.juice_avalability = true
    ) + (
        SELECT COUNT(*) 
        FROM bookaccessories_has bh 
        JOIN bookshop bs ON bh.shop_id = bs.bshop_id 
        WHERE bs.bshop_id = 'SH06' AND bh.bacc_avalability = true
    ) AS available_items,
    
    -- Count all pending orders (food + juice + book accessories)
    (
        SELECT COUNT(*) 
        FROM food_orders 
        WHERE fshop_id = 'SH06' AND order_status = 'pending'
    ) + (
        SELECT COUNT(*) 
        FROM juice_orders 
        WHERE jshop_id = 'SH06' AND order_status = 'pending'
    ) + (
        SELECT COUNT(*) 
        FROM bookaccessories_orders 
        WHERE bshop_id = 'SH01' AND order_status = 'pending'
    ) AS pending_orders,
    
    -- Sum all completed order quantities (food + juice + book accessories)
    (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM food_orders 
        WHERE fshop_id = 'SH06' AND order_status = 'completed'
    ) + (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM juice_orders 
        WHERE jshop_id = 'SH06' AND order_status = 'completed'
    ) + (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM bookaccessories_orders 
        WHERE bshop_id = 'SH06' AND order_status = 'completed'
    ) AS completed_quantity,
    
    -- Calculate total revenue from completed orders
    (
        SELECT COALESCE(SUM(fo.quantity * CAST(fh.food_price AS numeric)), 0)
        FROM food_orders fo
        JOIN food_has fh ON fo.food_id = fh.food_id AND fo.fshop_id = fh.shop_id
        WHERE fo.fshop_id = 'SH06' 
        AND fo.order_status = 'completed'
        AND fh.food_price ~ '^[0-9]+(\.[0-9]+)?$'
    ) + (
        SELECT COALESCE(SUM(jo.quantity * CAST(jh.juice_price AS numeric)), 0)
        FROM juice_orders jo
        JOIN juice_has jh ON jo.juice_id = jh.juice_id AND jo.jshop_id = jh.shop_id
        WHERE jo.jshop_id = 'SH06'
        AND jo.order_status = 'completed'
        AND jh.juice_price ~ '^[0-9]+(\.[0-9]+)?$'
    ) + (
        SELECT COALESCE(SUM(bo.quantity * CAST(bh.bacc_price AS numeric)), 0)
        FROM bookaccessories_orders bo
        JOIN bookaccessories_has bh ON bo.bacc_id = bh.bacc_id AND bo.bshop_id = bh.shop_id
        WHERE bo.bshop_id = 'SH06'
        AND bo.order_status = 'completed'
        AND bh.bacc_price ~ '^[0-9]+(\.[0-9]+)?$'
    ) AS total_revenue;