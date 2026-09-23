// Inject installGalleryProbe.toString() in the browser before a real link click.
// No application instrumentation or production globals are required.
export function installGalleryProbe(duration = 14000) {
  document.addEventListener('click', function start(event) {
    if (!event.target.closest('a,button')) return;
    const start = performance.now();
    const result = { url: '', frames: [], images: {}, resources: [], duration };
    window.galleryProbe = result;
    let previous = start;
    const originalDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      const src = this.getAttribute('src');
      return originalDecode.call(this).then(value => {
        if (src && !src.startsWith('data:')) {
          const entry = result.images[src] ||= {};
          entry.prepared ??= Math.round(performance.now() - start);
        }
        return value;
      });
    };
    function sample(now) {
      result.frames.push(now - previous);
      previous = now;
      result.url = location.pathname;
      for (const image of document.querySelectorAll('img[loading="eager"]')) {
        const src = image.getAttribute('src');
        if (!src || src.startsWith('data:')) continue;
        const entry = result.images[src] ||= {};
        let opacity = 1;
        for (let node = image; node; node = node.parentElement) {
          opacity *= Number(getComputedStyle(node).opacity);
        }
        const elapsed = Math.round(now - start);
        if (image.complete && image.naturalWidth) {
          entry.loaded ??= elapsed;
          if (!entry.decoding) {
            entry.decoding = true;
            image.decode().then(() => { entry.decoded = Math.round(performance.now() - start); });
          }
        }
        if (image.complete && image.naturalWidth) {
          if (opacity > 0.01) entry.visible ??= elapsed;
          if (opacity >= 0.99) entry.full ??= elapsed;
        }
      }
      if (now - start < duration) requestAnimationFrame(sample);
      else {
        result.resources = performance.getEntriesByType('resource')
          // Include pointerdown/short hover preparation immediately preceding the click.
          .filter(r => r.startTime >= start - 250)
          .map(r => ({ name: r.name, start: Math.round(r.startTime - start), end: Math.round(r.responseEnd - start), bytes: r.transferSize }));
        result.maxFrame = Math.max(...result.frames);
        result.framesOver50 = result.frames.filter(ms => ms > 50).length;
        result.done = true;
        HTMLImageElement.prototype.decode = originalDecode;
      }
    }
    requestAnimationFrame(sample);
  }, { once: true, capture: true });
}
