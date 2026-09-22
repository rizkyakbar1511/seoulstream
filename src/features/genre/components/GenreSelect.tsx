import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { fetchGenreList } from "../service";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenreSelectProps {
	currentGenre: string;
}

async function GenreSelect({ currentGenre }: GenreSelectProps) {
	const genres = await fetchGenreList();
	const activeGenre = genres.items.find(
		(genre) => genre.label === currentGenre,
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary">
					{activeGenre?.label ?? "Select genre..."} <ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search genre..." />
					<CommandList>
						<CommandEmpty>No genre found.</CommandEmpty>

						<CommandGroup>
							{genres.items.map((genre) => (
								<CommandItem
									className={cn(
										activeGenre?.label === genre.label &&
											"bg-primary text-white",
									)}
									key={genre.id}
									value={genre.label}
									asChild
								>
									<Link href={`/genre/${genre.label}`}>{genre.label}</Link>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default GenreSelect;
