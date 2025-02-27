import { NextResponse } from "next/server";

// Helper to convert a value to a simple text representation.
function transformToText(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  } else if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  } else {
    return value?.toString() || "";
  }
}

// Transform an object so that every field is simple text.
function transformDataToText(data) {
  const transformed = {};
  for (const key in data) {
    transformed[key] = transformToText(data[key]);
  }
  return transformed;
}

export async function POST(request) {
  try {
    // Parse JSON payload from the request body.
    const data = await request.json();

    // Extract query parameters from the URL.
    const { searchParams } = new URL(request.url);
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    // Store query parameters as a JSON string in a separate field.
    data["query params"] = JSON.stringify(queryParams);

    // Extract metadata from request headers.
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "unknown";
    
    // Add a timestamp and assume the referer represents the current page URL.
    const timestamp = new Date().toISOString();
    const currentPageUrl = referer;

    // Build the user metadata string.
    const userMetadata = `IP: ${ip}; User Agent: ${userAgent}; Referer: ${referer}; Timestamp: ${timestamp}; Current Page URL: ${currentPageUrl}`;
    data["user metadata"] = userMetadata;

    console.log("Feedback received with metadata and query params:", data);

    // Read Airtable configuration from environment variables.
    const airtablePat = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

    if (!airtablePat || !airtableBaseId || !airtableTableName) {
      throw new Error("Missing Airtable configuration in environment variables");
    }

    // Transform all data fields to simple text.
    const transformedData = transformDataToText(data);

    // Set the API URL for the table.
    let url = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`;
    let method = "POST";

    // If data contains a recordId, update (PATCH) the existing record.
    if (data.recordId) {
      method = "PATCH";
      url = `${url}/${data.recordId}`;
    }

    // Prepare payload for Airtable using the transformed data.
    const airtablePayload = {
      fields: transformedData,
    };

    const airtableRes = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${airtablePat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airtablePayload),
    });

    if (!airtableRes.ok) {
      const errorText = await airtableRes.text();
      console.error("Airtable error:", errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: airtableRes.status });
    }

    const airtableData = await airtableRes.json();
    // Save the returned Airtable record id to allow future upsert (update) operations.
    return NextResponse.json({ success: true, recordId: airtableData.id, airtable: airtableData });
  } catch (error) {
    console.error("Error posting to Airtable:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
