import Button from "@components/Button";

function DashboardErrorBoundary() {
  return (
    <div className="h-full grid place-items-center">
      <div className="max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="mb-6">
          We&apos;re having trouble processing your request. Please try again.
        </p>
        <div className="w-fit mx-auto">
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            label="Refresh"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardErrorBoundary;
