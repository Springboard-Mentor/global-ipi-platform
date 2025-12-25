package com.ipsearch.engine.loader;

import com.ipsearch.engine.entity.Filing;
import com.ipsearch.engine.entity.IPAsset;
import com.ipsearch.engine.entity.IPDocument;
import com.ipsearch.engine.entity.SearchHistory;
import com.ipsearch.engine.entity.enums.*;
import com.ipsearch.engine.repository.IPAssetRepository;
import com.ipsearch.engine.repository.IPDocumentRepository;
import com.ipsearch.engine.repository.SearchHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DataLoader inserts sample data into the database at application startup.
 * Helpful for testing entity mappings and verifying that tables are created correctly.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final IPAssetRepository ipAssetRepository;
    private final IPDocumentRepository ipDocumentRepository;
    private final SearchHistoryRepository searchHistoryRepository;

    public DataLoader(IPAssetRepository ipAssetRepository,
                      IPDocumentRepository ipDocumentRepository,
                      SearchHistoryRepository searchHistoryRepository) {
        this.ipAssetRepository = ipAssetRepository;
        this.ipDocumentRepository = ipDocumentRepository;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    /**
     * This method runs once when the application starts.
     */
    @Override
    @Transactional
    public void run(String... args) {
        // Clear existing data (optional for dev/testing; comment out for production usage)
        ipDocumentRepository.deleteAll();
        ipAssetRepository.deleteAll();
        searchHistoryRepository.deleteAll();

        loadSampleIpAssetsWithFilingsAndDocuments();
        loadSampleSearchHistory();
    }

    /**
     * Creates sample IP assets with related filings and documents.
     */
    private void loadSampleIpAssetsWithFilingsAndDocuments() {
        // ===== Sample PATENT asset =====
        IPAsset patentAsset = IPAsset.builder()
                .type(IPType.PATENT)
                .assetNumber("US1234567A1")
                .title("Sample Patent for AI-based Search Engine")
                .assignee("IPSearch Corp.")
                .inventor("John Doe")
                .jurisdiction("US")
                .filingDate(LocalDate.of(2020, 5, 20))
                .status(AssetStatus.ACTIVE)
                .assetClass("G06F 16/00")
                .details("A sample patent describing an AI-based search engine for patents and trademarks.")
                .apiSource(ApiSource.USPTO)
                .lastUpdated(LocalDateTime.now())
                .build();

        // Create a small legal status timeline for this patent
        Filing filing1 = Filing.builder()
                .date(LocalDate.of(2020, 5, 20))
                .status(FilingStatus.FILED)
                .description("Application filed with USPTO.")
                .build();

        Filing filing2 = Filing.builder()
                .date(LocalDate.of(2021, 1, 10))
                .status(FilingStatus.UNDER_EXAMINATION)
                .description("Under examination by the examiner.")
                .build();

        Filing filing3 = Filing.builder()
                .date(LocalDate.of(2022, 3, 15))
                .status(FilingStatus.GRANTED)
                .description("Patent granted and published.")
                .build();

        // Attach filings to the patent asset using helper method to keep both sides in sync
        patentAsset.addFiling(filing1);
        patentAsset.addFiling(filing2);
        patentAsset.addFiling(filing3);

        // Attach documents for this patent
        IPDocument patentPdf = IPDocument.builder()
                .documentName("Full Specification PDF")
                .documentType(DocumentType.PDF)
                .documentUrl("https://example.com/docs/us1234567a1.pdf")
                .uploadedAt(LocalDateTime.now())
                .build();

        IPDocument patentCertificate = IPDocument.builder()
                .documentName("Grant Certificate")
                .documentType(DocumentType.CERTIFICATE)
                .documentUrl("https://example.com/docs/us1234567a1_certificate.pdf")
                .uploadedAt(LocalDateTime.now())
                .build();

        patentAsset.addDocument(patentPdf);
        patentAsset.addDocument(patentCertificate);

        // Save the patent asset (will cascade to filings and documents)
        ipAssetRepository.save(patentAsset);

        // ===== Sample TRADEMARK asset =====
        IPAsset trademarkAsset = IPAsset.builder()
                .type(IPType.TRADEMARK)
                .assetNumber("TM987654")
                .title("IPSearch Logo")
                .assignee("IPSearch Corp.")
                .inventor("Brand Team")
                .jurisdiction("EU")
                .filingDate(LocalDate.of(2021, 8, 5))
                .status(AssetStatus.PENDING)
                .assetClass("35; 42")
                .details("Trademark protecting the IPSearch brand and logo.")
                .apiSource(ApiSource.TMVIEW)
                .lastUpdated(LocalDateTime.now())
                .build();

        Filing tmFiling1 = Filing.builder()
                .date(LocalDate.of(2021, 8, 5))
                .status(FilingStatus.FILED)
                .description("Trademark application filed with EUIPO.")
                .build();

        Filing tmFiling2 = Filing.builder()
                .date(LocalDate.of(2022, 2, 1))
                .status(FilingStatus.UNDER_EXAMINATION)
                .description("Under examination; office action issued.")
                .build();

        trademarkAsset.addFiling(tmFiling1);
        trademarkAsset.addFiling(tmFiling2);

        IPDocument officeAction = IPDocument.builder()
                .documentName("Office Action Letter")
                .documentType(DocumentType.OFFICE_ACTION)
                .documentUrl("https://example.com/docs/tm987654_office_action.pdf")
                .uploadedAt(LocalDateTime.now())
                .build();

        trademarkAsset.addDocument(officeAction);

        ipAssetRepository.save(trademarkAsset);
    }

    /**
     * Inserts sample search history entries.
     */
    private void loadSampleSearchHistory() {
        SearchHistory history1 = SearchHistory.builder()
                .keyword("AI search engine patent")
                .assignee("IPSearch Corp.")
                .inventor("John Doe")
                .jurisdiction("US")
                .searchedAt(LocalDateTime.now().minusDays(3))
                .build();

        SearchHistory history2 = SearchHistory.builder()
                .keyword("IPSearch logo trademark")
                .assignee("IPSearch Corp.")
                .inventor(null)
                .jurisdiction("EU")
                .searchedAt(LocalDateTime.now().minusDays(1))
                .build();

        SearchHistory history3 = SearchHistory.builder()
                .keyword("blockchain patent")
                .assignee(null)
                .inventor(null)
                .jurisdiction("EP")
                .searchedAt(LocalDateTime.now())
                .build();

        searchHistoryRepository.save(history1);
        searchHistoryRepository.save(history2);
        searchHistoryRepository.save(history3);
    }
}


