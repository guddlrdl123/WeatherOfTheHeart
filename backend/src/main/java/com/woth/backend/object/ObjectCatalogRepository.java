package com.woth.backend.object;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ObjectCatalogRepository extends JpaRepository<ObjectCatalog, Long> {

    Optional<ObjectCatalog> findByObjectKey(String objectKey);

    List<ObjectCatalog> findByIsActiveTrueOrderByIdAsc();
}
