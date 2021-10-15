--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0

-- Started on 2021-10-15 10:08:01 UTC

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
-- TOC entry 218 (class 1259 OID 16430)
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    id42 integer NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    site_owner boolean DEFAULT false,
    site_banned boolean DEFAULT false,
    site_moderator boolean DEFAULT false,
    "currentHashedRefreshToken" character varying,
    "twoFactorAuthenticationSecret" character varying,
    "isTwoFactorAuthenticationEnabled" boolean DEFAULT false NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    defeats integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    avatar character varying
);


ALTER TABLE public."user" OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16429)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO admin;

--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3206 (class 2604 OID 16433)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3362 (class 0 OID 16430)
-- Dependencies: 218
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, id42, email, name, site_owner, site_banned, site_moderator, "currentHashedRefreshToken", "twoFactorAuthenticationSecret", "isTwoFactorAuthenticationEnabled", victories, defeats, points, avatar) FROM stdin;
3	2	administraghost@mail.com	administraghost	f	f	f	$2b$10$zjWAs/lw1i2ZSh0F6l3pQOfWbAZ33A04JLhuVUawL2CCaKjnu2EQ.	\N	f	0	0	0	\N
4	4	modoghost@mail.com	modoghost	f	f	f	$2b$10$.dRaY3DdOVzTz4jXfBDVhucg9PdXiBCT8MAkUv9PxhDsTAFpqrsbm	\N	f	0	0	0	\N
5	3	casper@mail.com	casper	f	f	f	\N	\N	f	0	0	0	\N
2	1	ghosty@mail.com	ghosty	f	f	f	\N	\N	f	0	0	0	\N
\.


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 5, true);


--
-- TOC entry 3215 (class 2606 OID 16444)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 16450)
-- Name: user UQ_065d4d8f3b5adb4a08841eae3c8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE (name);


--
-- TOC entry 3219 (class 2606 OID 16446)
-- Name: user UQ_bb2eb81e5c868eac13282047c42; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_bb2eb81e5c868eac13282047c42" UNIQUE (id42);


--
-- TOC entry 3221 (class 2606 OID 16448)
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


-- Completed on 2021-10-15 10:08:08 UTC

--
-- PostgreSQL database dump complete
--

