import Link from "next/link";

export default function Submitted() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Application received</h1>
      <p className="mt-3 text-gray-600">
        Thank you for applying to sell on Meed. Your account is pending
        approval. Once approved you can log in and start listing products.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-md bg-lime-600 px-5 py-2 text-white hover:bg-lime-700"
      >
        Go to login
      </Link>
    </div>
  );
}
