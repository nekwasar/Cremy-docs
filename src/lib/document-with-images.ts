interface DocumentWithImages {
  id: string;
  title: string;
  content: string;
  sections: any[];
  images: Array<{
    id: string;
    src: string;
    alt: string;
    placement: string;
    sectionId?: string;
  }>;
  metadata: any;
}

export function embedImagesInDocument(
  document: any,
  images: Array<{ id: string; base64: string; altText: string; placement: string }>
): DocumentWithImages {
  const docImages = images.map((img) => ({
    id: img.id,
    src: img.base64,
    alt: img.altText,
    placement: img.placement,
  }));

  return {
    ...document,
    images: docImages,
    content: injectImageMarkers(document.content || '', docImages),
  };
}

function injectImageMarkers(
  content: string,
  images: Array<{ id: string; src: string; alt: string; placement: string }>
): string {
  let result = content;

  images.forEach((img) => {
    if (!result.includes(`[IMAGE:${img.id}]`)) {
      result += `\n\n![${img.alt}](${img.src})`;
    } else {
      result = result.replace(
        `[IMAGE:${img.id}]`,
        `![${img.alt}](${img.src})`
      );
    }
  });

  return result;
}

export function extractImagesFromDocument(document: DocumentWithImages): Array<{
  id: string;
  src: string;
  alt: string;
}> {
  return (document.images || []).map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
  }));
}
