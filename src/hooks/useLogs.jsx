import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./UseAxiosPublic";


const useLogs = () => {
    const axiosPublic = useAxiosPublic();

    const { data: logs = [], isPending: logsLoading, refetch:logsRefetch } = useQuery({
        queryKey: ['logs'],
        queryFn: async () => {
            const res = await axiosPublic.get('/logs');
            return res.data;
        }
    })

    return [logs, logsLoading, logsRefetch]
};

export default useLogs;