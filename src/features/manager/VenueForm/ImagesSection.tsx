type Media = { url: string; alt?: string };

type Props = {
  media: Media[];
  labelCls: string;
  inputCls: string;
  fieldsetCls: string;
  btnSecondary: string;
  addImage: () => void;
  removeImage: (idx: number) => void;
  updateMedia: (idx: number, key: "url" | "alt", val: string) => void;
};

export default function ImagesSection({
  media,
  labelCls,
  inputCls,
  fieldsetCls,
  btnSecondary,
  addImage,
  removeImage,
  updateMedia,
}: Props) {
  return (
    <section className={fieldsetCls}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Images</h3>
        <button type="button" className={btnSecondary} onClick={addImage}>
          Add image
        </button>
      </div>

      <div className="grid gap-3">
        {media.map((m, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-[1fr,1fr,auto]">
            <label className="block">
              <span className={labelCls}>Image URL</span>
              <input
                className={inputCls}
                placeholder="https://…"
                value={m.url}
                onChange={(e) => updateMedia(idx, "url", e.target.value)}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Alt text (optional)</span>
              <input
                className={inputCls}
                value={m.alt || ""}
                onChange={(e) => updateMedia(idx, "alt", e.target.value)}
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className={btnSecondary}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink/60">
        Tip: Use publicly reachable HTTPS URLs. The first image is used as the
        cover.
      </p>
    </section>
  );
}