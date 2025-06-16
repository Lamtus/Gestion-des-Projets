-- Supprimer la table chef existante
DROP TABLE IF EXISTS chef;

-- Recréer la table chef avec la bonne structure
CREATE TABLE chef (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_projet BIGINT,
    id_chef_projet BIGINT,
    FOREIGN KEY (id_projet) REFERENCES projet(id_projet),
    FOREIGN KEY (id_chef_projet) REFERENCES users(id)
); 