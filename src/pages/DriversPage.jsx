import AddDriverForm from "../components/AddDriverForm";
import DriversTable from "../components/DriversTable";

export default function DriversPage() {
  return (
    <div className="p-4">
     
      <AddDriverForm />
      <DriversTable />
    </div>
  );
}
