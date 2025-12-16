import bg from "../assets/restaurant-interior.jpg";

const foodQuotes = [
  {
    quote: "Great food is the foundation of genuine happiness.",
    author: "Auguste Escoffier",
  },
  {
    quote: "People who love to eat are always the best people.",
    author: "Julia Child",
  },
  {
    quote: "Cooking is love made visible.",
    author: "Unknown",
  },
  {
    quote:
      "One cannot think well, love well, sleep well, if one has not dined well.",
    author: "Virginia Woolf",
  },
  {
    quote: "Food is symbolic of love when words are inadequate.",
    author: "Alan D. Wolfelt",
  },
  {
    quote: "Life is uncertain. Eat dessert first.",
    author: "Ernestine Ulmer",
  },
  {
    quote: "There is no sincere love than the love of food.",
    author: "George Bernard Shaw",
  },
  {
    quote: "Good food is very often, even most often, simple food.",
    author: "Anthony Bourdain",
  },
  {
    quote: "Cooking is at once child's play and adult joy.",
    author: "Craig Claiborne",
  },
  {
    quote: "Food brings people together on many different levels.",
    author: "Giada De Laurentiis",
  },
  {
    quote: "First we eat, then we do everything else.",
    author: "M.F.K. Fisher",
  },
  {
    quote: "You don’t need a silver fork to eat good food.",
    author: "Paul Prudhomme",
  },
  {
    quote: "Food is our common ground, a universal experience.",
    author: "James Beard",
  },
  {
    quote: "Cooking is like love. It should be entered into with abandon.",
    author: "Harriet Van Horne",
  },
  {
    quote: "Good food ends with good talk.",
    author: "Geoffrey Neighor",
  },
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const randomQuote = foodQuotes[Math.floor(Math.random() * foodQuotes.length)];

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-6xl">
          {/* Welcome Section */}
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 text-rose-900">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-2">
              Soho Tavern Gateshead
            </p>
            <p className="text-sm sm:text-base italic text-gray-600">
              {new Date().toLocaleDateString("en-GB", {
                timeZone: "Europe/London",
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Restaurant Quote */}
          <div className="mt-8 sm:mt-12 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg">
            <blockquote className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl italic text-rose-900 font-serif mb-3">
                "{randomQuote.quote}"
              </p>
              <footer className="text-sm sm:text-base text-gray-600">
                — {randomQuote.author}
              </footer>
            </blockquote>
          </div>

          {/* Today's Highlights */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50/95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 mb-1">
                {new Date().toLocaleTimeString("en-GB", {
                  timeZone: "Europe/London",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs sm:text-sm text-amber-700">
                Current Time
              </div>
            </div>

            <div className="bg-rose-50/95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-rose-900 mb-1">
                {new Date().getDate()}
              </div>
              <div className="text-xs sm:text-sm text-rose-700">
                {new Date().toLocaleDateString("en-GB", {
                  month: "long",
                  timeZone: "Europe/London",
                })}
              </div>
            </div>

            <div className="bg-blue-50/95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">
                {
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    new Date().getDay()
                  ]
                }
              </div>
              <div className="text-xs sm:text-sm text-blue-700">Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
