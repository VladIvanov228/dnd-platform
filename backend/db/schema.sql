-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'player',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Кампании
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dm_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участники кампаний
CREATE TABLE campaign_players (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id),
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, user_id)
);

-- Персонажи
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    class VARCHAR(100),
    race VARCHAR(100),
    background VARCHAR(100),
    alignment VARCHAR(50),
    
    -- Характеристики
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    
    -- Боевые параметры
    hit_points INTEGER DEFAULT 10,
    armor_class INTEGER DEFAULT 10,
    
    -- Связи
    user_id INTEGER REFERENCES users(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заклинания (SRD данные)
CREATE TABLE spells (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 0,
    school VARCHAR(100),
    casting_time VARCHAR(100),
    range VARCHAR(100),
    components VARCHAR(100),
    duration VARCHAR(100),
    description TEXT,
    classes JSONB -- Массив классов, которые могут использовать заклинание
);

-- Монстры (SRD данные)
CREATE TABLE monsters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    type VARCHAR(100),
    alignment VARCHAR(100),
    armor_class INTEGER,
    hit_points INTEGER,
    speed JSONB, -- {walk: 30, fly: 60}
    stats JSONB, -- {strength: 16, dexterity: 12, ...}
    skills JSONB,
    senses JSONB,
    languages TEXT,
    challenge_rating DECIMAL(3,1),
    actions JSONB,
    legendary_actions JSONB
);

-- Карты
CREATE TABLE maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    width INTEGER DEFAULT 20,
    height INTEGER DEFAULT 20,
    tiles JSONB, -- Данные тайлов
    objects JSONB, -- Размещенные объекты
    campaign_id INTEGER REFERENCES campaigns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Игровые сессии
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id),
    current_map_id INTEGER REFERENCES maps(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);