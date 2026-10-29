import RegisterForm from "@/components/frontend/RegisterForm";

export const metadata = { title: "Sell on Meed" };

export default function Sell() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-12">
        <div className="w-full bg-white rounded-lg shadow-2xl dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 md:text-2xl dark:text-white">
              Sell on Meed
            </h1>
            <p className="text-sm text-center text-gray-500">
              Apply for a seller account. Meed reviews every application before
              you can list products.
            </p>
            <RegisterForm role="VENDOR" />
          </div>
        </div>
      </div>
    </section>
  );
}
