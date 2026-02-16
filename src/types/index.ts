export interface UseVideoPlayerProps {
	src: {
		channelId: number;
		hd: string;
		sd: string;
	};
	isHdAvailable: boolean;
}

export interface TmdbSearchResponse {
	page: number;
	results: TmbdbSearchResult[];
	total_pages: number;
	total_results: number;
}

export interface TmbdbSearchResult {
	adult: boolean;
	backdrop_path: null | string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: null | string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface TmdbCreditsResponse {
	id: number;
	cast: TmdbCast[];
	crew: TmdbCast[];
}

export interface TmdbCast {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: Department;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: null | string;
	cast_id?: number;
	character?: string;
	credit_id: string;
	order?: number;
	department?: Department;
	job?: string;
}

export enum Department {
	Acting = "Acting",
	Art = "Art",
	Camera = "Camera",
	CostumeMakeUp = "Costume & Make-Up",
	Creator = "Creator",
	Crew = "Crew",
	Directing = "Directing",
	Editing = "Editing",
	Lighting = "Lighting",
	Production = "Production",
	Sound = "Sound",
	VisualEffects = "Visual Effects",
	Writing = "Writing",
}

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

export interface GenreListResponse {
	status: string;
	count_total: number;
	genre: Genre[];
}

export interface Genre {
	genre_id: GenreNameEnum;
	genre_name: string;
	genre_status_hide: number;
}

export interface CategoryTypeResponse {
	status: string;
	count_total: number;
	category_type: CategoryType[];
}

export enum CategoryTypeNameEnum {
	KOREAN_SERIES = "Serial Drama Korea",
	THAILAND_SERIES = "Serial Drama Thailand",
	JAPAN_SERIES = "Serial Drama Jepang",
	MOVIE = "Movie",
	VARIETY_SHOW = "Variety Show",
}

export interface CategoryType {
	id: number;
	name: string;
	isactive: number;
}

export interface Category {
	cid: number;
	category_type: CategoryTypeNameEnum;
	category_name: string;
	count_anime: number;
	total_views: number;
	img_url: string;
	ongoing?: number;
	genre?: GenreNameEnum;
	rating: string;
	years: string;
	created?: string;
	updated?: string;
	new_episode?: boolean;
	days?: number;
}

export interface MovieListRequest {
	page: number;
	count: number;
	isAPKvalid: boolean;
}

export interface MovieListResponse {
	status: string;
	count: number;
	count_total: number;
	pages: number;
	categories: Category[];
}

// DramaDetailResponse omits several properties from Category because these fields
// are either not relevant for the detailed drama view, are handled separately,
// or are replaced by more specific fields in this interface.
export interface DramaDetailResponse
	extends Omit<
		Category,
		| "created"
		| "updated"
		| "new_episode"
		| "total_views"
		| "count_anime"
		| "days"
	> {
	status: string;
	channel_description: string;
	channel_name: string;
	channel_id: number;
	category_id: string;
	channel_url: string;
	channel_url_hd: string;
	is_hd_available: boolean;
	embed_url: string;
	download_url: string;
}

export type CategoryPost = Omit<
	DramaDetailResponse,
	"download_url" | "embed_url" | "channel_url" | "channel_url_hd"
> &
	Pick<Category, "created"> & { count_view: string };

export interface CategoryPostResponse {
	status: string;
	count: number;
	count_total: number;
	pages: number;
	category: Pick<
		Category,
		| "cid"
		| "category_name"
		| "category_type"
		| "img_url"
		| "rating"
		| "ongoing"
		| "genre"
		| "years"
	>;
	posts: CategoryPost[];
}
