import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "@/utils/theme-provider";
import { Moon, Sun, Settings, Bell, ClipboardCheck, LogOut, Menu, X, CircleArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchAllNotifications } from "@/redux/notificationSlice";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the mobile menu visibility
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");

    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notification.notifications);
    const count = useSelector((state: RootState) => state.notification.count);

    useEffect(() => {
        dispatch(fetchAllNotifications());
    }, []);

    return (
        <div className="sticky z-10 top-0 backdrop-blur-lg flex justify-between items-center px-4 sm:px-20 py-2">
            <div className="flex items-center justify-between w-full">
                {/* Logo or Brand Name */}
                <div className="text-xl sm:text-4xl">
                    {user.role === "ROLE_Admin" ? "bsheets" : (
                        <Link to="/" className="text-4xl">
                            BS
                        </Link>
                    )}
                </div>

                

                {/* Menu Items (Hidden on Small Screens) */}
                <div className={`lg:flex items-center gap-4 hidden flex-col lg:flex-row`}>
                    {user.role !== "ROLE_Admin" && (
                        <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                            <ClipboardCheck />
                        </Button>
                    )}

                    {user.role === "ROLE_Manager" && (
                        <Button variant="outline" size="sm" onClick={() => navigate("/manage")}>
                            <Settings />
                        </Button>
                    )}

                    {/* Notification Panel */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Bell />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Notification Panel</SheetTitle>
                                <SheetDescription></SheetDescription>
                                {
                                    notifications.length == 0 && <div>No new notifications.</div>
                                }
                                {
                                    notifications.length > 0 &&
                                    notifications.filter(notification => notification.readStatus == false).map(notification => {
                                        return (
                                            <Fragment key={ notification.id }>
                                                <div className="relative shadow-sm rounded-md px-4 py-2 flex flex-col items-start gap-2">
                                                    <div className="absolute h-full w-1 rounded-tl-md rounded-bl-md bg-primary left-0 top-0"></div>
                                                    <div className="text-xl font-bold">{ notification.title }</div>
                                                    <div className="text-xs">{ notification.description }</div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm"><CircleArrowRight />Interact</Button>
                                                        <Button variant="secondary" size="sm"><X />Dismiss</Button>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    })
                                }
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>

                    {/* Theme Toggle Button */}
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                        {theme === "dark" ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        )}
                    </Button>

                    {/* Log Out Button */}
                    <Button variant="secondary" size="sm">
                        <LogOut />
                    </Button>
                </div>
            </div>
            {/* Conditional Rendering of Mobile Menu */}
            {
                // <div className="lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-50 p-4">
                //     <div className="flex flex-col gap-4">
                //         {user.role !== "ROLE_Admin" && (
                //             <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                //                 <ClipboardCheck />
                //                 Tasks
                //             </Button>
                //         )}

                //         {user.role === "ROLE_Manager" && (
                //             <Button variant="outline" size="sm" onClick={() => navigate("/manage")}>
                //                 <Settings />
                //                 Manage
                //             </Button>
                //         )}

                //         <Button variant="outline" size="sm" onClick={toggleTheme}>
                //             {theme === "dark" ? (
                //                 <Sun className="h-[1.2rem] w-[1.2rem]" />
                //             ) : (
                //                 <Moon className="h-[1.2rem] w-[1.2rem]" />
                //             )}
                //             Theme
                //         </Button>

                //         <Button variant="secondary" size="sm" onClick={() => navigate("/manage")}>
                //             <LogOut />
                //             Log Out
                //         </Button>
                //     </div>
                // </div>
                <Sheet>
                    <SheetTrigger asChild>
                        {/* Hamburger Menu for Small Screens */}
                        <div className="lg:hidden flex items-center">
                            <Button variant="outline" size="sm" onClick={toggleMenu}>
                                <Menu />
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="top" className="flex flex-wrap items-start">
                        <SheetTitle className="w-full">Navigation Menu</SheetTitle>
                        <SheetDescription className="w-full"></SheetDescription>
                        {user.role !== "ROLE_Admin" && (
                            <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                                <ClipboardCheck /> Tasks
                            </Button>
                        )}

                        {user.role === "ROLE_Manager" && (
                            <Button variant="outline" size="sm" onClick={() => navigate("/manage")}>
                                <Settings /> Manage Tasks
                            </Button>
                        )}

                        {/* Notification Panel */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Bell /> Notifications
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Notification Panel</SheetTitle>
                                    <SheetDescription></SheetDescription>
                                    {
                                        notifications.length == 0 && <div>No new notifications.</div>
                                    }
                                    {
                                        notifications.length > 0 &&
                                        notifications.filter(notification => notification.readStatus == false).map(notification => {
                                            return (
                                                <Fragment key={ notification.id }>
                                                    <div className="relative shadow-sm rounded-md px-4 py-2 flex flex-col items-start gap-2">
                                                        <div className="absolute h-full w-1 rounded-tl-md rounded-bl-md bg-primary left-0 top-0"></div>
                                                        <div className="text-xl font-bold">{ notification.title }</div>
                                                        <div className="text-xs">{ notification.description }</div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm"><CircleArrowRight />Interact</Button>
                                                            <Button variant="secondary" size="sm"><X />Dismiss</Button>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    }
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>

                        {/* Theme Toggle Button */}
                        <Button variant="outline" size="sm" onClick={toggleTheme}>
                            {theme === "dark" ? (
                                <Fragment>
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span>Light Mode</span>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <span>Dark Mode</span>
                                </Fragment>
                            )}
                        </Button>

                        {/* Log Out Button */}
                        <Button variant="secondary" size="sm">
                            <LogOut /> Log out
                        </Button>
                    </SheetContent>
                </Sheet>
            }
        </div>
    );
}
