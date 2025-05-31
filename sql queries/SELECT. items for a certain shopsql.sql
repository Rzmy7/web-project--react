SELECT 
    s.name AS shopName,
    s.status AS status,
    s.opentime AS openingTime,
    s.closetime AS closingTime,
    s.location AS location,
    JSON_AGG(json_build_object('id', c.category_id, 'name', c.name, 'items', COALESCE(items.items, '[]'))) AS menudata
FROM 
    shop s
LEFT JOIN LATERAL (
    SELECT 
        c.id AS category_id, -- Use c.id instead of c.category_id
        c.name AS categoryName,
        JSON_AGG(json_build_object('id', i.item_id, 'name', i.name, 'price', si.price, 'status', si.availability)) AS items
    FROM 
        shopItem si
    JOIN 
        items i ON si.item_id = i.item_id
    JOIN 
        categories c ON i.category_id::INTEGER = c.id -- Cast i.category_id to INTEGER
    WHERE 
        si.shop_id = s.shopid
    GROUP BY 
        c.id, c.name
) AS items ON true
LEFT JOIN categories c ON items.category_id = c.id
GROUP BY 
    s.name, s.status, s.opentime, s.closetime, s.location, c.id, c.name
ORDER BY 
    s.name;