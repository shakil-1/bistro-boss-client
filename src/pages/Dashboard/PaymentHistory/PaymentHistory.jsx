import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()

  const { data:payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
        const res = await axiosSecure.get(`/payments?email=${user?.email}`)
        return res.data;
    },
  });
 
  
console.log(payments);

  return <div>
    <h2 className="text-3xl">Total Payments : {payments.length}</h2>
    <div>
    <div className="overflow-x-auto">
  <table className="table w-full">
    <thead>
      <tr>
        <th>
         
        </th>
        <th>EMAIL</th>
        <th>TOTAL PRICE</th>
        <th>Tranjition Id</th>
        <th>PAYENT DATE</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
     {
        payments.map((payment, index) => <tr className="hover" key={payment._id}>
         <td>
            {index + 1}
         </td>
        <td>
         {payment.email}
        </td>
       
        <td>{payment.price}</td>
        <td>{payment.tranjitionId}</td>
        <td>{payment.date}</td>
        <td> {payment.status}</td>
        </tr>)
     }
    </tbody>
  
  </table>
</div>
    </div>
  </div>;
};

export default PaymentHistory;
