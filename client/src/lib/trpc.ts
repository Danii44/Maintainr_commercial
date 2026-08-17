// Compatibility shim for an inactive copied component. The active commercial quotation
// form posts only to /.netlify/functions/quote-request; this file never opens a SaaS API connection.
export const trpc = {
  quote: {
    request: {
      useMutation: (_options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => ({
        isPending: false,
        mutate: (_input: unknown) => {
          throw new Error("The active quotation form uses the commercial quote-request function.");
        },
      }),
    },
  },
};
