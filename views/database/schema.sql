-- blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    blog_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    main_content TEXT NOT NULL
);