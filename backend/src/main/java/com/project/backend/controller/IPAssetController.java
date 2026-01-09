package com.project.backend.controller;

import com.project.backend.entity.IPAsset;
import com.project.backend.service.IPAssetService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; 

@RestController
@RequestMapping("/api/ipassets")
@CrossOrigin(origins = "*") // Allows your React app to access these APIs
public class IPAssetController {

    private final IPAssetService ipAssetService;

    public IPAssetController(IPAssetService ipAssetService) {
        this.ipAssetService = ipAssetService;
    }

    // ⭐ NEW: Synchronization Endpoint to fix 404
    /**
     * POST /api/assets/sync
     * Receives a list of IPAssets from an external source for batch saving/updating.
     */
    @PostMapping("/sync")
    public ResponseEntity<List<IPAsset>> syncAssets(@RequestBody List<IPAsset> assets) {
        if (assets == null || assets.isEmpty()) {
            // Optional: return BAD_REQUEST if no assets are provided
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        // Delegates to the service layer for de-duplication and persistence logic
        List<IPAsset> savedAssets = ipAssetService.saveOrUpdateAll(assets);
        
        // Returns the list of assets that were successfully processed
        return ResponseEntity.ok(savedAssets); 
    }
    // ⭐ END NEW

    // 🔗 CREATE: POST /api/assets
    @PostMapping
    public ResponseEntity<IPAsset> create(@RequestBody IPAsset asset) {
        return ResponseEntity.ok(ipAssetService.createAsset(asset));
    }

    // 🔗 READ (Paginated Search): GET /api/assets/search
    @GetMapping("/search")
    public ResponseEntity<Page<IPAsset>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "ALL") String type,
            @RequestParam(defaultValue = "all") String source,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastUpdated") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        return ResponseEntity.ok(ipAssetService.search(keyword, type, source, page, size, sortBy, sortDirection));
    }

    // 🔗 READ (Single): GET /api/assets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IPAsset> getById(@PathVariable Integer id) {
        return ipAssetService.getAssetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔗 UPDATE: PUT /api/assets/{id}
    @PutMapping("/{id}")
    public ResponseEntity<IPAsset> update(@PathVariable Integer id, @RequestBody IPAsset asset) {
        return ResponseEntity.ok(ipAssetService.updateAsset(id, asset));
    }

    // 🔗 DELETE: DELETE /api/assets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ipAssetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}