package com.sigedu.backend.util;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

public final class CsvExportUtil {

    private CsvExportUtil() {
    }

    public static byte[] toCsvBytes(List<String> headers, List<List<String>> rows) {
        StringBuilder csv = new StringBuilder();
        // BOM para que Excel reconozca UTF-8 y muestre tildes/ñ correctamente.
        csv.append('\uFEFF');
        csv.append(toLine(headers));
        for (List<String> row : rows) {
            csv.append(toLine(row));
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String toLine(List<String> values) {
        return values.stream()
                .map(CsvExportUtil::escape)
                .collect(Collectors.joining(",")) + "\n";
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.replace("\r", " ").replace("\n", " ").trim();
        boolean mustQuote = normalized.contains(",") || normalized.contains("\"") || normalized.contains(";");
        normalized = normalized.replace("\"", "\"\"");
        return mustQuote ? "\"" + normalized + "\"" : normalized;
    }
}
