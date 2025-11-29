import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api'; // Correct Import
import { Button } from '../components/Button';
import { Todo } from '../types';
import { 
  LogOut, 
  Plus, 
  Trash2, 
  Square,
  CheckSquare,
  Edit3, 
  X, 
  Save 
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const todoSchema = z.object({
  title: z.string().min(1, 'Task cannot be empty'),
});

type TodoFormValues = z.infer<typeof todoSchema>;

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. FETCH TODOS
  // Note: user.id pass karne ki zarurat nahi, token sambhal lega
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'], 
    queryFn: api.getTodos, // FIX: Direct function reference
    enabled: !!user,
  });

  // 2. CREATE TODO
  const createMutation = useMutation({
    mutationFn: (title: string) => api.createTodo({ title }), // FIX: Object pass kar rahe hain
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      reset();
    },
  });

  // 3. TOGGLE COMPLETE
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      api.updateTodo(id, { completed }), // FIX: Direct call
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  // 4. DELETE TODO
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTodo(id), // FIX: Direct call
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  // 5. UPDATE TITLE
  const updateTitleMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => 
      api.updateTodo(id, { title }), // FIX: Direct call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingId(null);
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
  });

  const onAddTodo = (data: TodoFormValues) => {
    createMutation.mutate(data.title);
  };

  // Inline Edit Component
  const EditItem = ({ todo }: { todo: Todo }) => {
    const [title, setTitle] = useState(todo.title);
    
    return (
      <div className="flex items-center gap-2 flex-1 animate-in fade-in duration-200">
        <input 
          autoFocus
          className="flex-1 h-8 rounded border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateTitleMutation.mutate({ id: todo.id, title });
            if (e.key === 'Escape') setEditingId(null);
          }}
        />
        <button 
          onClick={() => updateTitleMutation.mutate({ id: todo.id, title })}
          disabled={updateTitleMutation.isPending}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
        >
          <Save size={16} />
        </button>
        <button 
          onClick={() => setEditingId(null)}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-zinc-100 rounded flex items-center justify-center text-zinc-950 font-bold">
              TF
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 hidden sm:block">TaskFlow Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 font-mono hidden sm:block">
              USER: <span className="text-zinc-300">{user?.name}</span>
            </span>
            <Button variant="secondary" onClick={logout} className="gap-2 h-8 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        
        {/* Add Todo Form */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">My Tasks</h2>
          <form onSubmit={handleSubmit(onAddTodo)} className="flex gap-2">
            <div className="flex-1">
              <input 
                placeholder="Add a new task..." 
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <Button 
              type="submit" 
              className="h-10 px-4 gap-2 bg-zinc-100 text-zinc-950 hover:bg-white"
              isLoading={createMutation.isPending}
            >
              <Plus size={18} />
              Add
            </Button>
          </form>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {isLoading ? (
             <div className="space-y-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-12 bg-zinc-900 rounded-md animate-pulse"></div>
               ))}
             </div>
          ) : todos?.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-900 rounded-lg">
              <div className="mx-auto h-10 w-10 text-zinc-800 mb-3 flex items-center justify-center">
                <CheckSquare className="h-8 w-8" />
              </div>
              <p className="text-zinc-600 text-sm">No tasks pending</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {todos?.map((todo: Todo) => (
                <div 
                  key={todo.id} 
                  className={`group flex items-center gap-3 p-3 bg-zinc-900/40 rounded-md border transition-all duration-200 ${
                    todo.completed 
                      ? 'border-transparent opacity-50' 
                      : 'border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })}
                    disabled={toggleMutation.isPending}
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      todo.completed ? 'text-zinc-500' : 'text-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {todo.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>

                  {/* Content */}
                  {editingId === todo.id ? (
                    <EditItem todo={todo} />
                  ) : (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span 
                        className={`text-sm truncate transition-all duration-200 ${
                          todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
                        }`}
                      >
                        {todo.title}
                      </span>
                      {/* Hover Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => setEditingId(todo.id)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(todo.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};