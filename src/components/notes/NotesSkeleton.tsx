import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

type NotesSkeletonProps = {
  count: number
}
export const NotesSkeleton = ({ count }: NotesSkeletonProps) => (
  <>
    {new Array(count).fill(0).map((_, i) =>
      <Card key={i} className="h-[243px]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="w-[58px] h-[22px] rounded-full" />
            <Skeleton className="w-[32px] h-[24px] rounded-lg" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[96px] rounded-md" />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Skeleton className="w-[24px] h-[24px] rounded-md" />
          <Skeleton className="w-[60px] h-[20px] rounded-md" />
        </CardFooter>
      </Card>
    )}
  </>
)

export default NotesSkeleton