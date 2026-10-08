GRANT SELECT, INSERT, UPDATE, DELETE ON public.authors, public.categories, public.tags, public.articles, public.article_tags TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.authors_id_seq, public.categories_id_seq, public.tags_id_seq, public.articles_id_seq TO anon;
CREATE POLICY "Anyone manages authors" ON public.authors FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone manages categories" ON public.categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone manages tags" ON public.tags FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone manages articles" ON public.articles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone manages article tags" ON public.article_tags FOR ALL TO anon USING (true) WITH CHECK (true);