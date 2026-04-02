import LatestTransactions from 'src/components/ui/LatestTransactions';

export default function TransactionsPage() {
  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col gap-6 p-4 mx-auto lg:p-8 sm:p-6 w-full h-full max-w-7xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Transactions Page
        </h1>

        <LatestTransactions limit={25} />
      </div>
    </div>
  );
}
