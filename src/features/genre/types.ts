export enum GenreNameEnum {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  ANIMALS = "Animals",
  ANIMATION = "Animation",
  ARTS = "Arts",
  BIOGRAPHY = "Biography",
  BUSINESS = "Business",
  COMEDY = "Comedy",
  CRIME = "Crime",
  DEMONS = "Demons",
  DETECTIVE = "Detective",
  DOCUMENTARY = "Documentary",
  DRAMA = "Drama",
  ECCHI = "Ecchi",
  FAMILY = "Family",
  FANTASY = "Fantasy",
  FOOD = "Food",
  FRIENDSHIP = "Friendship",
  GAME = "Game",
  HAREM = "Harem",
  HISTORICAL = "Historical",
  HISTORY = "History",
  HORROR = "Horror",
  INVESTIGATION = "Investigation",
  LAW = "Law",
  LIFE = "Life",
  MAGIC = "Magic",
  MARTIAL = "Martial",
  MATURE = "Mature",
  MEDICAL = "Medical",
  MELODRAMA = "Melodrama",
  MILITARY = "Military",
  MUSIC = "Music",
  MYSTERY = "Mystery",
  POLICE = "Police",
  POLITICAL = "Political",
  PSYCHOLOGICAL = "Psychological",
  ROMANCE = "Romance",
  SCHOOL = "School",
  SCI_FI = "Sci-fi",
  SHOUJO = "Shoujo",
  SHOUNEN = "Shounen",
  SITCOM = "Sitcom",
  SLICE_OF_LIFE = "Slice of Life",
  SPORTS = "Sports",
  SUPERNATURAL = "Supernatural",
  SUSPENSE = "Suspense",
  THRILLER = "Thriller",
  TOKUSATSU = "Tokusatsu",
  TRAGEDY = "Tragedy",
  VAMPIRE = "Vampire",
  WAR = "War",
  WUXIA = "Wuxia",
  YOUTH = "Youth",
  ZOMBIES = "Zombies",
}

export interface Genre {
  id: number;
  label: string;
  value: number;
}

export interface GenreList {
  items: Genre[];
  total: number;
}
