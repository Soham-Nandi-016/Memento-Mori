"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

export interface DriveFilePage {
  files: DriveFile[];
  nextPageToken: string | null;
  totalFetched: number;
}

const FIELDS = "nextPageToken,files(id,name,mimeType,modifiedTime,size)";

/**
 * Server Action: Fetches a paginated batch of files from Google Drive.
 *
 * @param pageToken  - Pass null / undefined for the first page.
 *                     Pass the token returned in a previous response for the next page.
 * @param pageSize   - Number of files per batch (max 100 per Drive API limits).
 */
export async function fetchDriveFiles(
  pageToken?: string | null,
  pageSize = 100
): Promise<DriveFilePage> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Not authenticated or no Drive access token.");
  }

  const params = new URLSearchParams({
    pageSize: String(Math.min(pageSize, 100)),
    fields: FIELDS,
    orderBy: "modifiedTime desc",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "401 — Drive token expired. Please sign out and sign back in to re-authorize."
      );
    }
    if (res.status === 403) {
      throw new Error(
        "403 — Drive scope insufficient. Sign out, sign back in and approve the Drive permission."
      );
    }
    const errText = await res.text();
    throw new Error(`Drive API error: ${res.status} — ${errText}`);
  }

  const data = await res.json() as {
    files?: DriveFile[];
    nextPageToken?: string;
  };

  return {
    files: data.files ?? [],
    nextPageToken: data.nextPageToken ?? null,
    totalFetched: (data.files ?? []).length,
  };
}
