import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaBook, FaDollarSign, FaList, FaUsers } from "react-icons/fa";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats", "order-stats"],
    queryFn: async () => {
      const resAdminStats = await axiosSecure.get("/admin-stats");
      const resOrderStats = await axiosSecure.get("/order-stats");
      return { stats: resAdminStats.data, orderStats: resOrderStats.data };
    },
  });
  if (isLoading) {
    return <p>loading</p>;
  }
  // console.log(stats.orderStats[0].category);

  // console.log(orderStats);

  // CustomShapeBarChart
  if (!stats.orderStats || stats.orderStats.length === 0) {
    return <p>No order stats available</p>;
  }

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  // PieChartWihCustomizedLavel
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const pieChartData = stats.orderStats.map((data) => {
    return { name: data.category, value: data.revenue };
  });

  return (
    <div>
      <h2 className="text-3xl font-bold uppercase  ">
        <span>Admin </span>
        <span className="text-orange-500">
          {user?.displayName ? user.displayName : "Back"}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto ">
        <div className="h-36 w-full  stat bg-gradient-to-r from-[#BB34F5]  to-[#FCDBFF] rounded-md flex justify-center items-center text-[#FFFFFF]">
          {/* <div className="stat-figure text-secondary">
          <FaDollarSign className="text-3xl"></FaDollarSign>
          </div> */}
          <FaDollarSign className="text-6xl"></FaDollarSign>
          <div className=" ">
            <div className="stat-value">{stats.stats?.revenue}</div>
            <div className="stat-title font-bold text-[#FFFFFF]">Revenue</div>
          </div>
        </div>

        <div className="h-36 w-full  stat bg-gradient-to-r from-[#D3A256] to-[#FDE8C0] rounded-md flex justify-center items-center text-[#FFFFFF]">
          <FaUsers className="text-6xl"></FaUsers>

          <div>
            <div className="stat-value">{stats.stats?.users}</div>
            <div className="stat-title font-bold text-[#FFFFFF]">Users</div>
          </div>
        </div>

        <div className="h-36 w-full   stat bg-gradient-to-r from-[#FE4880] to-[#FECDE9] rounded-md flex justify-center items-center text-[#FFFFFF]">
          <FaBook className="text-5xl"></FaBook>
          <div>
            <div className="stat-value">{stats.stats?.menuItems}</div>
            <div className="stat-title font-bold text-[#FFFFFF]">
              Menu Items
            </div>
          </div>
        </div>

        <div className="h-36 w-full   stat bg-gradient-to-r from-[#6AAEFF] to-[#B6F7FF] rounded-md flex justify-center items-center text-[#FFFFFF]">
          <FaList className="text-5xl"></FaList>
          <div>
            <div className="stat-value">{stats.stats?.orders}</div>
            <div className="stat-title font-bold text-[#FFFFFF]">Orders</div>
          </div>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-1/2">
          <BarChart
            width={800}
            height={500}
            data={stats.orderStats}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Bar
              dataKey="quantity"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}
            >
              {stats.orderStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 6]} />
              ))}
            </Bar>
          </BarChart>
        </div>
        <div className="w-1/2 ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend></Legend>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
