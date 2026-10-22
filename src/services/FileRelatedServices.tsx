
export async function AddContentToUnit(courseId:string,file:FormData) {
    const response = await fetch(`http://localhost:3000/api/AddContentToUnit/${encodeURIComponent(courseId)}`,{
        method:'PATCH',
        body: file
    })

     const responseText = await response.text();
    if (!response.ok) {
            throw new Error(
          `HTTP ${response.status}: ${responseText}`
    );}

    return JSON.parse(responseText);
}

