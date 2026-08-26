type AdviceSampleProps = {
  context: string;
  body: string;
};

/** Presentational reading block. Not connected to a catalogue. */
export function AdviceSample({ context, body }: AdviceSampleProps) {
  return (
    <article>
      <hr className="hairline mb-[var(--space-5)]" aria-hidden="true" />
      <p className="type-context m-0">{context}</p>
      <p className="type-advice mt-[var(--space-4)] m-0">{body}</p>
    </article>
  );
}
