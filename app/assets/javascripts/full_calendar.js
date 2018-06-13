$(document).ready(function() {


        /* initialize the external events
        -----------------------------------------------------------------*/

        $('#external-events div.fc-event').each(function() {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });
    });

    var initialize_calendar;
    initialize_calendar = function() {
      $('#calendar').each(function(){
        var calendar = $(this);
        calendar.fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          selectable: true,
          selectHelper: true,
          droppable: true,
          editable: true,
          eventLimit: true,
          eventSources: [
            '/events.json',
            '/recurring_events.json'
          ],
          select: function(start, end) {
            $.getScript('/events/new', function() {
              $('#event_date_range').val(moment(start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(end).format("MM/DD/YYYY HH:mm"))
              date_range_picker();
              $('.start_hidden').val(moment(start).format('YYYY-MM-DD HH:mm'));
              $('.end_hidden').val(moment(end).format('YYYY-MM-DD HH:mm'));
            });

            calendar.fullCalendar('unselect');
          },
          drop: function(date, jsEvent, ui, resourceId) {
  console.log('drop', date.format(), resourceId);
  $.getScript('/events/new', function() {
    $('#event_date_range').val(date.format("MM/DD/YYYY HH:mm") + ' - ' + date.format("MM/DD/YYYY HH:mm"))
    date_range_picker();
    $('.start_hidden').val(date.format('YYYY-MM-DD HH:mm'));
    $('.end_hidden').val(date.format('YYYY-MM-DD HH:mm'));
  });
  // is the "remove after drop" checkbox checked?
  if ($('#drop-remove').is(':checked')) {
    // if so, remove the element from the "Draggable Events" list
    $(this).remove();
  }
},

          eventDrop: function(event, delta, revertFunc) {
            event_data = {
              event: {
                id: event.id,
                start: event.start.format(),
                end: event.end.format()
              }
            };
            $.ajax({
                url: event.update_url,
                data: event_data,
                type: 'PATCH'
            });
          },

          eventClick: function(event, jsEvent, view) {
            $.getScript(event.edit_url, function() {
              $('#event_date_range').val(moment(event.start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(event.end).format("MM/DD/YYYY HH:mm"))
              date_range_picker();
              $('.start_hidden').val(moment(event.start).format('YYYY-MM-DD HH:mm'));
              $('.end_hidden').val(moment(event.end).format('YYYY-MM-DD HH:mm'));
            });
          }
        });
      })
    };
    $(document).on('turbolinks:load', initialize_calendar);
