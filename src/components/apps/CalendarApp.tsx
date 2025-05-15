
import { useState, useMemo, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  color: string;
}

const COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Red", value: "#ef4444" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

const CalendarApp = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("orbit-calendar-events");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }));
      } catch (err) {
        console.error("Failed to parse saved events", err);
        return [];
      }
    }
    return [];
  });
  
  const [newEventData, setNewEventData] = useState<{
    title: string;
    date: Date;
    time: string;
    description: string;
    color: string;
  }>({
    title: "",
    date: new Date(),
    time: "",
    description: "",
    color: COLORS[0].value,
  });
  
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewingEvent, setIsViewingEvent] = useState(false);

  // Save events when they change
  const saveEvents = useCallback((newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem(
      "orbit-calendar-events",
      JSON.stringify(newEvents)
    );
  }, []);

  // Get events for the selected date
  const eventsForDate = useMemo(() => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  }, [events, date]);

  // Get events for the selected month (for highlighting days with events)
  const eventsForMonth = useMemo(() => {
    return events.filter(
      (event) =>
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  }, [events, date]);

  // Navigate between months
  const navigateMonth = (direction: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + direction);
    setDate(newDate);
  };

  // Format date for display
  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Add a new event
  const addEvent = () => {
    if (!newEventData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: newEventData.title,
      date: newEventData.date,
      time: newEventData.time || undefined,
      description: newEventData.description || undefined,
      color: newEventData.color,
    };

    saveEvents([...events, newEvent]);
    setIsAddingEvent(false);
    toast.success("Event added");

    // Reset form
    setNewEventData({
      title: "",
      date: new Date(),
      time: "",
      description: "",
      color: COLORS[0].value,
    });
  };

  // Delete an event
  const deleteEvent = (eventId: string) => {
    saveEvents(events.filter((e) => e.id !== eventId));
    setIsViewingEvent(false);
    toast.info("Event deleted");
  };

  // View event details
  const viewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewingEvent(true);
  };

  // Function to highlight days with events
  const isDayWithEvent = (day: Date) => {
    return eventsForMonth.some(
      (event) => 
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Calendar Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{formatDateHeader(date)}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
            <ChevronRight size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              setNewEventData({...newEventData, date});
              setIsAddingEvent(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Add Event
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b">
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <div className="flex justify-center py-2">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="month" className="p-0">
            <div className="flex h-full">
              {/* Calendar */}
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-none border-0"
                  styles={{
                    day_today: {
                      backgroundColor: "#f3f4f6",
                      fontWeight: "bold",
                    },
                    day_selected: {
                      backgroundColor: "#3b82f6",
                      color: "white",
                    },
                  }}
                  modifiers={{
                    withEvent: (date) => isDayWithEvent(date),
                  }}
                  modifiersStyles={{
                    withEvent: {
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }
                  }}
                />
              </div>

              {/* Events for selected date */}
              <div className="w-72 border-l p-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">
                    {date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setNewEventData({...newEventData, date});
                      setIsAddingEvent(true);
                    }}
                  >
                    <Plus size={14} />
                  </Button>
                </div>

                {eventsForDate.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No events for this day</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setNewEventData({...newEventData, date});
                        setIsAddingEvent(true);
                      }}
                    >
                      Add an event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eventsForDate
                      .sort((a, b) => {
                        if (!a.time) return -1;
                        if (!b.time) return 1;
                        return a.time.localeCompare(b.time);
                      })
                      .map((event) => (
                        <div
                          key={event.id}
                          className="p-2 rounded border hover:bg-gray-50 cursor-pointer"
                          onClick={() => viewEvent(event)}
                        >
                          <div className="flex items-start">
                            <div 
                              className="w-3 h-3 rounded-full mt-1.5 mr-2" 
                              style={{ backgroundColor: event.color }} 
                            />
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              {event.time && (
                                <p className="text-xs text-gray-500">
                                  {event.time}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="p-4 h-full overflow-auto text-center">
            <div className="flex flex-col items-center justify-center h-full">
              <CalendarIcon size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Week View</p>
              <p className="text-gray-500">
                The week view is not implemented in this demo.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="day" className="p-4 h-full overflow-auto text-center">
            <div className="flex flex-col items-center justify-center h-full">
              <CalendarIcon size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Day View</p>
              <p className="text-gray-500">
                The day view is not implemented in this demo.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Input
                placeholder="Event Title"
                value={newEventData.title}
                onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                className="mb-2"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Date</label>
                <div className="flex items-center border rounded px-3 py-1.5">
                  <CalendarIcon size={16} className="mr-2 text-gray-500" />
                  <span>
                    {newEventData.date.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Time (optional)</label>
                <div className="flex items-center border rounded overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-50 border-r">
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <Input 
                    type="time"
                    value={newEventData.time}
                    onChange={(e) => setNewEventData({...newEventData, time: e.target.value})}
                    className="border-0"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewEventData({...newEventData, color: color.value})}
                    className={`w-8 h-8 rounded-full ${
                      newEventData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <textarea
                rows={3}
                placeholder="Add description"
                value={newEventData.description}
                onChange={(e) => setNewEventData({...newEventData, description: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Cancel</Button>
            <Button onClick={addEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewingEvent} onOpenChange={setIsViewingEvent}>
        {selectedEvent && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center mb-4">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: selectedEvent.color }} 
                />
                <div className="flex items-center text-gray-500">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>
                    {selectedEvent.date.toLocaleDateString()}
                    {selectedEvent.time && `, ${selectedEvent.time}`}
                  </span>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div className="mt-4 text-gray-700">
                  {selectedEvent.description}
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => deleteEvent(selectedEvent.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
              <Button onClick={() => setIsViewingEvent(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CalendarApp;
