package com.sigedu.backend.repository;

import com.sigedu.backend.entity.DetallePago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetallePagoRepository extends JpaRepository<DetallePago, Integer> {
    List<DetallePago> findByPagoIdPago(Integer idPago);
}