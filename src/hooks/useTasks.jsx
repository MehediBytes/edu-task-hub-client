import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./UseAxiosPublic";


const useTasks = () => {
    const axiosPublic = useAxiosPublic();

    const { data: tasks = [], isPending: tasksLoading, refetch:tasksRefetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await axiosPublic.get('/tasks');
            return res.data;
        }
    })

    return [tasks, tasksLoading, tasksRefetch]
};

export default useTasks;