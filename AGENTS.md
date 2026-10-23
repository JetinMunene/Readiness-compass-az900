<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Question bank lives in src/lib/questions.ts as typed data; extend by appending, ids must stay unique (tests enforce this).
- Readiness math is centralised in src/lib/readiness.ts and covered by readiness.test.ts; pages only display its output.
- Learner data currently goes through src/lib/store.ts (browser-only local mode); swap its internals when adding cloud persistence so pages stay unchanged.
