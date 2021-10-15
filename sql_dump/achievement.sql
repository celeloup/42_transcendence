--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0

-- Started on 2021-10-15 09:59:48 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3355 (class 1262 OID 16385)
-- Name: nestjs; Type: DATABASE; Schema: -; Owner: admin
--

-- CREATE DATABASE nestjs WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE nestjs OWNER TO admin;

\connect nestjs

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16421)
-- Name: achievement; Type: TABLE; Schema: public; Owner: admin
--

-- CREATE TABLE public.achievement (
--     id integer NOT NULL,
--     name character varying NOT NULL,
--     description character varying NOT NULL
-- );


-- ALTER TABLE public.achievement OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16420)
-- Name: achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

-- CREATE SEQUENCE public.achievement_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


ALTER TABLE public.achievement_id_seq OWNER TO admin;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 215
-- Name: achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

-- ALTER SEQUENCE public.achievement_id_seq OWNED BY public.achievement.id;


--
-- TOC entry 3206 (class 2604 OID 16424)
-- Name: achievement id; Type: DEFAULT; Schema: public; Owner: admin
--

-- ALTER TABLE ONLY public.achievement ALTER COLUMN id SET DEFAULT nextval('public.achievement_id_seq'::regclass);


--
-- TOC entry 3349 (class 0 OID 16421)
-- Dependencies: 216
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.achievement (id, name, description) VALUES (1, 'first_friend', 'Congratulations ! You made a friend ! You are not alone anymore in this big universe.');
INSERT INTO public.achievement (id, name, description) VALUES (2, '10_victories', '10 victories ? You''re on a roll !');
INSERT INTO public.achievement (id, name, description) VALUES (3, '100_points', 'A HUNDRED POINTS ?? You are a pro pong gamer ! GG !');


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 215
-- Name: achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.achievement_id_seq', 1, false);


--
-- TOC entry 3208 (class 2606 OID 16428)
-- Name: achievement PK_441339f40e8ce717525a381671e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY (id);


-- Completed on 2021-10-15 09:59:54 UTC

--
-- PostgreSQL database dump complete
--

