async function createPaste() {
  const content = document.getElementById("content").value;
  const ttl = document.getElementById("ttl").value;
  const maxViews = document.getElementById("maxViews").value;

  if (!content.trim()) {
    alert("Content is required");
    return;
  }

  const payload = {
    content,
    ttl_seconds: ttl ? Number(ttl) : undefined,
    max_views: maxViews ? Number(maxViews) : undefined,
  };

  try {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    window.location.href = data.url;
  } catch {
    alert("Failed to create paste");
  }
}
