import { useState } from 'react';
import {
    Bell,
    X,
    Check,
    Info,
    Calendar,
    DollarSign,
    Users,
    FileText,
    Trash2,
    CheckCircle2
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
    category: 'system' | 'payment' | 'exam' | 'attendance' | 'event';
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'success',
        title: 'Fee Payment Received',
        message: 'Payment of $450 received from Emma Davis (Class 10-A)',
        time: '5 min ago',
        read: false,
        category: 'payment'
    },
    {
        id: '2',
        type: 'info',
        title: 'New Exam Schedule',
        message: 'Mid-term Mathematics exam scheduled for February 15, 2026',
        time: '1 hour ago',
        read: false,
        category: 'exam'
    },
    {
        id: '3',
        type: 'warning',
        title: 'Low Attendance Alert',
        message: 'Class 9-B has below 85% attendance this week',
        time: '2 hours ago',
        read: false,
        category: 'attendance'
    },
    {
        id: '4',
        type: 'info',
        title: 'Upcoming Event',
        message: 'Annual Sports Meet on February 25 - Preparation meeting tomorrow',
        time: '3 hours ago',
        read: true,
        category: 'event'
    },
    {
        id: '5',
        type: 'success',
        title: 'System Update Complete',
        message: 'Student management system updated to version 2.4.1',
        time: 'Yesterday',
        read: true,
        category: 'system'
    },
    {
        id: '6',
        type: 'error',
        title: 'Pending Fee Collection',
        message: '15 students have pending fees for this month',
        time: 'Yesterday',
        read: true,
        category: 'payment'
    },
];

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationIcon = (_type: string, category: string) => {
        switch (category) {
            case 'payment':
                return <DollarSign size={18} />;
            case 'exam':
                return <FileText size={18} />;
            case 'attendance':
                return <Users size={18} />;
            case 'event':
                return <Calendar size={18} />;
            default:
                return <Info size={18} />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-100 text-emerald-600';
            case 'warning':
                return 'bg-amber-100 text-amber-600';
            case 'error':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-blue-100 text-blue-600';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Notification Panel */}
            <div className="fixed top-0 right-0 h-screen w-full md:w-96 bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200/50 bg-white/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Bell className="text-indigo-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                                {unreadCount > 0 && (
                                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X size={18} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white/50 text-gray-600 hover:bg-white'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${filter === 'unread'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white/50 text-gray-600 hover:bg-white'
                                }`}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Actions */}
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="w-full mt-3 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                        <div className="p-4 space-y-3">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-xl border transition-all group hover:shadow-md ${notification.read
                                        ? 'bg-white/30 border-white/40'
                                        : 'bg-white/60 border-indigo-200/50 shadow-sm'
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)
                                            }`}>
                                            {getNotificationIcon(notification.type, notification.category)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className={`font-semibold text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'
                                                    }`}>
                                                    {notification.title}
                                                </h4>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{notification.time}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="w-7 h-7 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                            <Bell size={48} className="opacity-50 mb-3" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200/50 bg-white/50">
                    <button className="w-full px-4 py-2.5 bg-white/50 hover:bg-white text-gray-700 rounded-lg text-sm font-medium transition-colors border border-white/40">
                        View All Notifications
                    </button>
                </div>
            </div>
        </>
    );
};
