javascript: (async function () {
  const accessToken =
    __remixContext.state.loaderData.root.clientBootstrap.session.accessToken;

  const data = await fetch(
    "https://chatgpt.com/backend-api/conversations?offset=0&limit=28&order=updated",
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "OAI-Language": "en-US",
        // "OAI-Device-Id": "c52f08f2-853b-4517-9d54-c84632a45604",
        Authorization: `Bearer ${accessToken}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=4",
      },
      // "referrer": "https://chatgpt.com/c/737d7a1e-96f5-4ce3-a6eb-c6567acac430",
      method: "GET",
      mode: "cors",
    },
  ).then((r) => r.json());

  const csvText =
    "url\ttitle\tcreate_time\tupdate_time\n" +
    data.items
      .map((item) => {
        const url = `https://chatgpt.com/c/${item.id}`;

        return `${url}\t${item.title}\t${item.create_time}\t${item.update_time}`;
      })
      .join("\n");

  const blob = new Blob([csvText], { type: "text/tab-separated-values" });

  async function blobToDataUrl(blob) {
    return new Promise((r) => {
      let a = new FileReader();
      a.onload = r;
      a.readAsDataURL(blob);
    }).then((e) => e.target.result);
  }

  const downloadUrl = await blobToDataUrl(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "chatgpt-conversations.tsv";

  link.click();
})();